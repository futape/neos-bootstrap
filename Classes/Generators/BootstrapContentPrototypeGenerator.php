<?php
namespace Futape\Bootstrap\Generators;

use Neos\ContentRepository\Domain\Model\NodeType;
use Neos\Flow\Annotations as Flow;
use Neos\Neos\Domain\Service\DefaultPrototypeGenerator;

/**
 * Generate a Fusion prototype definition based on `Neos.Fusion:Value`
 * and a `value` of `Neos.Neos:Content`
 *
 * @Flow\Scope("singleton")
 */
class BootstrapContentPrototypeGenerator extends DefaultPrototypeGenerator
{
    /**
     * The Name of the prototype that is extended
     *
     * @var string
     */
    protected $basePrototypeName = 'Neos.Neos:Content';


	/**
	 * Generate a Fusion prototype definition for a given node type
	 *
	 * A node will be rendered by `Neos.Fusion:Value` by default and the `value`
	 * is set to `Neos.Neos:Content`.
	 * No other magic happens here.
	 *
	 * @param NodeType $nodeType
	 * @return string
	 */
    public function generate(NodeType $nodeType)
    {
        if (strpos($nodeType->getName(), ':') === false) {
            return '';
        }

        $output = 'prototype(' . $nodeType->getName() . ') < prototype(Neos.Fusion:Value) {' . chr(10);

        $output .= "\t" . 'value = ' . $this->basePrototypeName . chr(10);

        $output .= '}' . chr(10);
        return $output;
    }
}
